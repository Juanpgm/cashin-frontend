import { Badge } from "@/components/ui/Badge";
import type { EstadoCuentaCobro } from "@/types/models";
import { ESTADOS_CUENTA } from "@/utils/constants";
import React from "react";

interface EstadoBadgeProps {
  estado: EstadoCuentaCobro;
}

export function EstadoBadge({ estado }: EstadoBadgeProps) {
  const config = ESTADOS_CUENTA[estado];
  return <Badge label={config.label} color={config.color} />;
}
