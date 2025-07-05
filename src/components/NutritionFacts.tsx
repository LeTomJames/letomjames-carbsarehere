import React, { useState } from "react";
import {
  Card,
  Text,
  Stack,
  Group,
  Badge,
  Progress,
  Divider,
  Image,
  Title,
  Grid,
  Paper,
  ThemeIcon,
  Switch,
} from "@mantine/core";
import {
  IconFlame,
  IconDroplet,
  IconWheat,
  IconMeat,
  IconSalt,
  IconApple,
} from "@tabler/icons-react";
import type { Product } from "../App";

interface NutritionFactsProps {
  product: Product;
}

const NutritionFacts: React.FC<NutritionFactsProps> = ({ product }) => {
  const [useKcal, setUseKcal] = useState(true); // true for kcal, false for cal

  const getNutritionGradeColor = (grade: string) => {
    switch (grade?.toLowerCase()) {
      case "a":
        return "green";
      case "b":
        return "lime";
      case "c":
        return "yellow";
      case "d":
        return "orange";
      case "e":
        return "red";
      default:
        return "gray";
    }
  };

  const getNutritionGradeLabel = (grade: string) => {
    switch (grade?.toLowerCase()) {
      case "a":
        return "Excellent";
      case "b":
        return "Good";
      case "c":
        return "Average";
      case "d":
        return "Poor";
      case "e":
        return "Bad";
      default:
        return "Not rated";
    }
  };

  const getProgressColor = (value: number, max: number) => {
    const percentage = (value / max) * 100;
    if (percentage > 75) return "red";
    if (percentage > 50) return "yellow";
    if (percentage > 25) return "lime";
    return "green";
  };

  const nutrients = product.nutriments || {};
  const calories = nutrients["energy-kcal_100g"] || 0;
  const fat = nutrients["fat_100g"] || 0;
  const saturatedFat = nutrients["saturated-fat_100g"] || 0;
  const carbs = nutrients["carbohydrates_100g"] || 0;
  const sugars = nutrients["sugars_100g"] || 0;
  const fiber = nutrients["fiber_100g"] || 0;
  const protein = nutrients["proteins_100g"] || 0;
  const salt = nutrients["salt_100g"] || 0;
  const sodium = nutrients["sodium_100g"] || 0;

  return (
    <Stack gap="md" mt="md">
      {/* Product Header */}
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Group align="flex-start" gap="md">
          {product.image_url && (
            <Image
              src={product.image_url}
              alt={product.product_name}
              w={80}
              h={80}
              radius="md"
              fallbackSrc="https://via.placeholder.com/80x80/f0f0f0/999?text=No+Image"
            />
          )}
          <div style={{ flex: 1 }}>
            <Title order={3} lineClamp={2} mb="xs">
              {product.product_name || "Unknown Product"}
            </Title>
            {product.brands && (
              <Text size="sm" c="dimmed" mb="xs">
                {product.brands}
              </Text>
            )}
            {product.nutrition_grades && (
              <Badge
                color={getNutritionGradeColor(product.nutrition_grades)}
                size="lg"
                variant="filled"
              >
                Nutri-Score {product.nutrition_grades.toUpperCase()} -{" "}
                {getNutritionGradeLabel(product.nutrition_grades)}
              </Badge>
            )}
          </div>
        </Group>
      </Card>

      {/* Nutrition Facts */}
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Group justify="space-between" align="center" mb="md">
          <Title order={4}>Nutrition Facts</Title>
          <Text size="sm" c="dimmed">
            per 100g
          </Text>
        </Group>

        <Stack gap="sm">
          {/* Calories */}
          <Paper
            p="sm"
            radius="md"
            style={{ backgroundColor: "var(--mantine-color-blue-0)" }}
          >
            <Group justify="space-between" align="center">
              <Group gap="sm">
                <ThemeIcon color="blue" variant="light" size="lg">
                  <IconFlame size={20} />
                </ThemeIcon>
                <div>
                  <Group gap="xs" align="center">
                    <Text fw={500}>Calories</Text>
                    <Switch
                      size="xs"
                      checked={useKcal}
                      onChange={(event) =>
                        setUseKcal(event.currentTarget.checked)
                      }
                      onLabel="kcal"
                      offLabel="cal"
                      color="blue"
                      title={
                        useKcal
                          ? "Switch to calories (cal)"
                          : "Switch to kilocalories (kcal)"
                      }
                    />
                  </Group>
                  <Text size="sm" c="dimmed">
                    Energy {useKcal ? "(kilocalories)" : "(calories)"}
                  </Text>
                </div>
              </Group>
              <Text size="xl" fw={700} c="blue">
                {useKcal
                  ? `${calories.toFixed(0)} kcal`
                  : `${(calories * 1000).toFixed(0)} cal`}
              </Text>
            </Group>
          </Paper>

          <Divider />

          {/* Macronutrients */}
          <Grid gutter="md">
            <Grid.Col span={6}>
              <Paper p="sm" radius="md" withBorder>
                <Group gap="sm" mb="xs">
                  <ThemeIcon color="red" variant="light" size="sm">
                    <IconDroplet size={14} />
                  </ThemeIcon>
                  <Text fw={500} size="sm">
                    Fat
                  </Text>
                </Group>
                <Text size="lg" fw={600} mb="xs">
                  {fat.toFixed(1)}g
                </Text>
                <Progress
                  value={Math.min((fat / 35) * 100, 100)}
                  color={getProgressColor(fat, 35)}
                  size="sm"
                  mb="xs"
                />
                {saturatedFat > 0 && (
                  <Text size="xs" c="dimmed">
                    Saturated: {saturatedFat.toFixed(1)}g
                  </Text>
                )}
              </Paper>
            </Grid.Col>

            <Grid.Col span={6}>
              <Paper p="sm" radius="md" withBorder>
                <Group gap="sm" mb="xs">
                  <ThemeIcon color="orange" variant="light" size="sm">
                    <IconWheat size={14} />
                  </ThemeIcon>
                  <Text fw={500} size="sm">
                    Carbs
                  </Text>
                </Group>
                <Text size="lg" fw={600} mb="xs">
                  {carbs.toFixed(1)}g
                </Text>
                <Progress
                  value={Math.min((carbs / 50) * 100, 100)}
                  color={getProgressColor(carbs, 50)}
                  size="sm"
                  mb="xs"
                />
                {sugars > 0 && (
                  <Text size="xs" c="dimmed">
                    Sugars: {sugars.toFixed(1)}g
                  </Text>
                )}
              </Paper>
            </Grid.Col>

            <Grid.Col span={6}>
              <Paper p="sm" radius="md" withBorder>
                <Group gap="sm" mb="xs">
                  <ThemeIcon color="green" variant="light" size="sm">
                    <IconMeat size={14} />
                  </ThemeIcon>
                  <Text fw={500} size="sm">
                    Protein
                  </Text>
                </Group>
                <Text size="lg" fw={600} mb="xs">
                  {protein.toFixed(1)}g
                </Text>
                <Progress
                  value={Math.min((protein / 50) * 100, 100)}
                  color="green"
                  size="sm"
                />
              </Paper>
            </Grid.Col>

            <Grid.Col span={6}>
              <Paper p="sm" radius="md" withBorder>
                <Group gap="sm" mb="xs">
                  <ThemeIcon color="teal" variant="light" size="sm">
                    <IconApple size={14} />
                  </ThemeIcon>
                  <Text fw={500} size="sm">
                    Fiber
                  </Text>
                </Group>
                <Text size="lg" fw={600} mb="xs">
                  {fiber.toFixed(1)}g
                </Text>
                <Progress
                  value={Math.min((fiber / 25) * 100, 100)}
                  color="teal"
                  size="sm"
                />
              </Paper>
            </Grid.Col>

            {(salt > 0 || sodium > 0) && (
              <Grid.Col span={12}>
                <Paper p="sm" radius="md" withBorder>
                  <Group gap="sm" mb="xs">
                    <ThemeIcon color="gray" variant="light" size="sm">
                      <IconSalt size={14} />
                    </ThemeIcon>
                    <Text fw={500} size="sm">
                      Salt
                    </Text>
                  </Group>
                  <Text size="lg" fw={600} mb="xs">
                    {salt > 0
                      ? `${salt.toFixed(2)}g`
                      : `${(sodium * 2.5).toFixed(2)}g`}
                  </Text>
                  <Progress
                    value={Math.min(
                      ((salt > 0 ? salt : sodium * 2.5) / 6) * 100,
                      100
                    )}
                    color={getProgressColor(salt > 0 ? salt : sodium * 2.5, 6)}
                    size="sm"
                  />
                </Paper>
              </Grid.Col>
            )}
          </Grid>
        </Stack>
      </Card>

      {/* Ingredients */}
      {product.ingredients_text && (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Title order={4} mb="md">
            Ingredients
          </Title>
          <Text size="sm" style={{ lineHeight: 1.6 }}>
            {product.ingredients_text}
          </Text>
        </Card>
      )}
    </Stack>
  );
};

export default NutritionFacts;
