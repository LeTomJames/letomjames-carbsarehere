import React from "react";
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

  // Adjust progress bar max values based on serving vs per 100g
  const getProgressMax = (nutrient: string, defaultMax: number) => {
    if (!isPerServing) return defaultMax;
    // For per-serving, we use lower max values as serving sizes are typically smaller
    const servingMaxValues: { [key: string]: number } = {
      fat: 20, // vs 35 for 100g
      carbs: 30, // vs 50 for 100g
      protein: 25, // vs 50 for 100g
      fiber: 15, // vs 25 for 100g
      salt: 2.5, // vs 6 for 100g
    };
    return servingMaxValues[nutrient] || defaultMax;
  };

  const nutrients = product.nutriments || {};

  // Determine if we should show per serving or per 100g
  const hasServingData =
    nutrients["energy-kcal_serving"] !== undefined ||
    nutrients["fat_serving"] !== undefined ||
    nutrients["carbohydrates_serving"] !== undefined ||
    nutrients["proteins_serving"] !== undefined;

  const isPerServing = hasServingData;
  const servingSize = product.serving_size || "1 serving";

  // Get nutrition values (prefer serving data if available)
  const calories = isPerServing
    ? nutrients["energy-kcal_serving"] || 0
    : nutrients["energy-kcal_100g"] || 0;

  const fat = isPerServing
    ? nutrients["fat_serving"] || 0
    : nutrients["fat_100g"] || 0;

  const saturatedFat = isPerServing
    ? nutrients["saturated-fat_serving"] || 0
    : nutrients["saturated-fat_100g"] || 0;

  const carbs = isPerServing
    ? nutrients["carbohydrates_serving"] || 0
    : nutrients["carbohydrates_100g"] || 0;

  const sugars = isPerServing
    ? nutrients["sugars_serving"] || 0
    : nutrients["sugars_100g"] || 0;

  const fiber = isPerServing
    ? nutrients["fiber_serving"] || 0
    : nutrients["fiber_100g"] || 0;

  const protein = isPerServing
    ? nutrients["proteins_serving"] || 0
    : nutrients["proteins_100g"] || 0;

  const salt = isPerServing
    ? nutrients["salt_serving"] || 0
    : nutrients["salt_100g"] || 0;

  const sodium = isPerServing
    ? nutrients["sodium_serving"] || 0
    : nutrients["sodium_100g"] || 0;

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
            per {isPerServing ? servingSize : "100g"}
          </Text>
        </Group>

        <Stack gap="sm">
          {/* Calories */}
          <Paper
            p="sm"
            radius="md"
            withBorder
            style={{ 
              backgroundColor: 'var(--mantine-color-primary-light)',
              borderColor: 'var(--mantine-color-primary-outline)'
            }}
          >
            <Group justify="space-between" align="center">
              <Group gap="sm">
                <ThemeIcon color="blue" variant="light" size="lg">
                  <IconFlame size={20} />
                </ThemeIcon>
                <div>
                  <Text fw={500}>Calories</Text>
                  <Text size="sm" c="dimmed">
                    Energy (kilocalories)
                  </Text>
                </div>
              </Group>
              <Text size="xl" fw={700} c="var(--mantine-primary-color-filled)">
                {calories.toFixed(0)} kcal
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
                  value={Math.min((fat / getProgressMax("fat", 35)) * 100, 100)}
                  color={getProgressColor(fat, getProgressMax("fat", 35))}
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
                  value={Math.min(
                    (carbs / getProgressMax("carbs", 50)) * 100,
                    100
                  )}
                  color={getProgressColor(carbs, getProgressMax("carbs", 50))}
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
                  value={Math.min(
                    (protein / getProgressMax("protein", 50)) * 100,
                    100
                  )}
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
                  value={Math.min(
                    (fiber / getProgressMax("fiber", 25)) * 100,
                    100
                  )}
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
                      ((salt > 0 ? salt : sodium * 2.5) /
                        getProgressMax("salt", 6)) *
                        100,
                      100
                    )}
                    color={getProgressColor(
                      salt > 0 ? salt : sodium * 2.5,
                      getProgressMax("salt", 6)
                    )}
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
