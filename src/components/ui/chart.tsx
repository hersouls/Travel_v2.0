"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";

import { cn } from "./utils";

const THEMES = {
  light: {
    background: "hsl(0 0% 100%)",
    foreground: "hsl(222.2 84% 4.9%)",
    primary: "hsl(222.2 47.4% 11.2%)",
    secondary: "hsl(210 40% 96%)",
    muted: "hsl(210 40% 96%)",
    accent: "hsl(210 40% 96%)",
    destructive: "hsl(0 84.2% 60.2%)",
    border: "hsl(214.3 31.8% 91.4%)",
    input: "hsl(214.3 31.8% 91.4%)",
    ring: "hsl(222.2 84% 4.9%)",
    chart: {
      "1": "hsl(222.2 84% 4.9%)",
      "2": "hsl(210 40% 96%)",
      "3": "hsl(210 40% 96%)",
      "4": "hsl(210 40% 96%)",
      "5": "hsl(210 40% 96%)",
    },
  },
  dark: {
    background: "hsl(222.2 84% 4.9%)",
    foreground: "hsl(210 40% 98%)",
    primary: "hsl(210 40% 98%)",
    secondary: "hsl(217.2 32.6% 17.5%)",
    muted: "hsl(217.2 32.6% 17.5%)",
    accent: "hsl(217.2 32.6% 17.5%)",
    destructive: "hsl(0 62.8% 30.6%)",
    border: "hsl(217.2 32.6% 17.5%)",
    input: "hsl(217.2 32.6% 17.5%)",
    ring: "hsl(212.7 26.8% 83.9%)",
    chart: {
      "1": "hsl(210 40% 98%)",
      "2": "hsl(217.2 32.6% 17.5%)",
      "3": "hsl(217.2 32.6% 17.5%)",
      "4": "hsl(217.2 32.6% 17.5%)",
      "5": "hsl(217.2 32.6% 17.5%)",
    },
  },
} as const;

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: "light" | "dark" }
  );
};

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps>({
  config: {},
});

function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error("useChart must be used within a ChartProvider");
  }
  return context;
}

function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig;
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >["children"];
}) {
  return (
    <ChartContext.Provider value={{ config }}>
      <div className={cn("h-[--radix-chart-height] w-full", className)} {...props}>
        <RechartsPrimitive.ResponsiveContainer
          width="100%"
          height="100%"
          className="h-[--radix-chart-height] w-full"
        >
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const theme = Object.values(config).find((item) => item.theme)?.theme;
  const colors = theme ? THEMES[theme as keyof typeof THEMES] : THEMES.light;

  return (
    <style
      id={id}
      dangerouslySetInnerHTML={{
        __html: `
          [data-radix-chart-area="true"] {
            fill: hsl(${colors.chart["1"]});
          }
          [data-radix-chart-area="true"][data-radix-chart-area="2"] {
            fill: hsl(${colors.chart["2"]});
          }
          [data-radix-chart-area="true"][data-radix-chart-area="3"] {
            fill: hsl(${colors.chart["3"]});
          }
          [data-radix-chart-area="true"][data-radix-chart-area="4"] {
            fill: hsl(${colors.chart["4"]});
          }
          [data-radix-chart-area="true"][data-radix-chart-area="5"] {
            fill: hsl(${colors.chart["5"]});
          }
        `,
      }}
    />
  );
};

interface ChartPayloadItem {
  value?: number | string;
  name?: string;
  dataKey?: string;
  payload?: {
    fill?: string;
  };
  color?: string;
}

function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey,
}: React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
  React.ComponentProps<"div"> & {
    hideLabel?: boolean;
    hideIndicator?: boolean;
    indicator?: "line" | "dot" | "dashed";
    nameKey?: string;
    labelKey?: string;
  } & {
    payload?: ChartPayloadItem[];
    label?: unknown;
  }) {
  const { config } = useChart();

  const tooltipLabel = React.useMemo(() => {
    if (hideLabel) {
      return null;
    }

    const item = payload?.[0] as ChartPayloadItem;
    const key = `${labelKey || item?.dataKey || item?.name || "value"}`;
    const itemConfig = getPayloadConfigFromPayload(config, item, key);
    const value =
      !labelKey && typeof label === "string"
        ? config[label as keyof typeof config]?.label || label
        : itemConfig?.label;

    if (labelFormatter) {
      return (
        <div className={cn("font-medium", labelClassName)}>
          {labelFormatter(value, (payload as ChartPayloadItem[]) || [])}
        </div>
      );
    }

    if (!value) {
      return null;
    }

    return <div className={cn("font-medium", labelClassName)}>{value}</div>;
  }, [
    label,
    labelFormatter,
    payload,
    hideLabel,
    labelClassName,
    config,
    labelKey,
  ]);

  if (!active || !payload?.length) {
    return null;
  }

  const nestLabel = payload.length === 1 && indicator !== "dot";

  return (
    <div
      className={cn(
        "border-border/50 bg-background grid min-w-[8rem] items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl",
        className,
      )}
    >
      {!nestLabel ? tooltipLabel : null}
      <div className="grid gap-1.5">
        {payload?.map((item: ChartPayloadItem) => {
          const key = `${nameKey || item.name || item.dataKey || "value"}`;
          const itemConfig = getPayloadConfigFromPayload(config, item, key);
          const indicatorColor = color || item.payload?.fill || item.color;

          return (
            <div
              key={item.dataKey}
              className={cn(
                "[&>svg]:text-muted-foreground flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5",
                indicator === "dot" && "items-center",
              )}
            >
              {formatter && item.value !== undefined && item.name ? (
                formatter(item.value as number, item.name, item as ChartPayloadItem, 0, [item.payload as { fill?: string }])
              ) : (
                <>
                  {itemConfig?.icon ? (
                    <itemConfig.icon />
                  ) : (
                    !hideIndicator && (
                      <div
                        className={cn(
                          "shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)",
                          {
                            "h-2.5 w-2.5": indicator === "dot",
                            "w-1": indicator === "line",
                            "w-0 border-[1.5px] border-dashed bg-transparent":
                              indicator === "dashed",
                            "my-0.5": nestLabel && indicator === "dashed",
                          },
                        )}
                        style={
                          {
                            "--color-bg": indicatorColor,
                            "--color-border": indicatorColor,
                          } as React.CSSProperties
                        }
                      />
                    )
                  )}
                  <div
                    className={cn(
                      "flex flex-1 justify-between leading-none",
                      nestLabel ? "items-end" : "items-center",
                    )}
                  >
                    <div className="grid gap-1.5">
                      {nestLabel ? tooltipLabel : null}
                      <span className="text-muted-foreground">
                        {itemConfig?.label || item.name}
                      </span>
                    </div>
                    {item.value !== undefined && item.value !== null && (
                      <span className="font-medium">
                        {typeof item.value === "number"
                          ? item.value.toLocaleString()
                          : item.value}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = "bottom",
  nameKey,
}: React.ComponentProps<"div"> &
  Pick<RechartsPrimitive.LegendProps, "verticalAlign"> & {
    hideIcon?: boolean;
    nameKey?: string;
    payload?: ChartPayloadItem[];
  }) {
  const { config } = useChart();

  if (!payload?.length) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 text-xs",
        verticalAlign === "top" && "order-first",
        className,
      )}
    >
      {payload.map((item: ChartPayloadItem) => {
        const key = `${nameKey || item.name || item.dataKey || "value"}`;
        const itemConfig = getPayloadConfigFromPayload(config, item, key);
        const indicatorColor = item.payload?.fill || item.color;

        return (
          <div
            key={item.dataKey}
            className="flex items-center gap-1.5"
          >
            <div
              className="h-2.5 w-2.5 rounded-[2px] border border-border bg-background"
              style={
                {
                  "--color-bg": indicatorColor,
                  "--color-border": indicatorColor,
                } as React.CSSProperties
              }
            />
            {itemConfig?.icon && !hideIcon && <itemConfig.icon />}
            <span className="text-muted-foreground">
              {itemConfig?.label || item.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string,
) {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const item = payload as ChartPayloadItem;
  const configKey = key || item.name || item.dataKey;

  if (!configKey || !config[configKey]) {
    return null;
  }

  return config[configKey];
}

export {
  ChartContainer,
  ChartStyle,
  ChartTooltipContent,
  ChartLegendContent,
  useChart,
  THEMES,
};
