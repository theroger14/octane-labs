import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      volume_cm3,
      material_id,
      infill_percent = 20,
      quantity = 1,
    } = body as {
      volume_cm3: number;
      material_id: string;
      infill_percent?: number;
      quantity?: number;
    };

    if (volume_cm3 == null || !material_id) {
      return NextResponse.json(
        { error: "Missing volume_cm3 or material_id" },
        { status: 400 },
      );
    }

    const { data: material, error } = await supabase
      .from("materials")
      .select("name, price_per_gram, density")
      .eq("id", material_id)
      .eq("active", true)
      .single();

    if (error || !material) {
      return NextResponse.json({ error: "Material not found" }, { status: 404 });
    }

    const infill = Math.min(100, Math.max(0, infill_percent)) / 100;

    // Walls are always ~15% solid regardless of infill
    const effective_volume = volume_cm3 * (infill + (1 - infill) * 0.15);
    const weight_grams = effective_volume * material.density;
    const material_cost = weight_grams * material.price_per_gram;

    const print_time_hours = weight_grams / 13; // 13 g/hour average
    const machine_cost = print_time_hours * 15; // $15 MXN/hour

    const setup_cost = 40; // fixed per piece

    const subtotal = material_cost + machine_cost + setup_cost;
    const price_per_unit = Math.max(subtotal * 1.35, 120); // 35% margin, $120 MXN min
    const total = price_per_unit * quantity;

    return NextResponse.json({
      weight_grams: +weight_grams.toFixed(2),
      print_time_hours: +print_time_hours.toFixed(2),
      price_per_unit: +price_per_unit.toFixed(2),
      total: +total.toFixed(2),
      breakdown: {
        effective_volume: +effective_volume.toFixed(4),
        material_cost: +material_cost.toFixed(2),
        machine_cost: +machine_cost.toFixed(2),
        setup_cost,
        subtotal: +subtotal.toFixed(2),
        margin: +(subtotal * 0.35).toFixed(2),
      },
    });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
