import axios from 'axios'
import type { Product } from '../App'

const OPENFOODFACTS_API_URL = 'https://world.openfoodfacts.org/api/v2/product'

export interface OpenFoodFactsResponse {
  code: string
  product?: Product
  status: number
  status_verbose: string
}

export const getNutritionData = async (barcode: string): Promise<Product | null> => {
  try {
    const response = await axios.get<OpenFoodFactsResponse>(
      `${OPENFOODFACTS_API_URL}/${barcode}.json`
    )

    if (response.data.status === 1 && response.data.product) {
      return response.data.product
    }

    return null
  } catch (error) {
    console.error('Error fetching nutrition data:', error)
    throw new Error('Failed to fetch nutrition data')
  }
}

// Mock data for testing purposes
export const getMockNutritionData = (barcode: string): Product => {
  return {
    product_name: `Mock Product for ${barcode}`,
    brands: 'Mock Brand',
    image_url: 'https://via.placeholder.com/300x300/4CAF50/white?text=Mock+Product',
    nutriments: {
      'energy-kcal_100g': 250,
      'fat_100g': 12.5,
      'saturated-fat_100g': 3.2,
      'carbohydrates_100g': 28.0,
      'sugars_100g': 15.5,
      'fiber_100g': 4.2,
      'proteins_100g': 8.5,
      'salt_100g': 1.2,
      'sodium_100g': 0.48,
    },
    nutrition_grades: 'c',
    ingredients_text: 'Mock ingredients: wheat flour, sugar, vegetable oil, salt, natural flavors, vitamins and minerals. May contain traces of nuts and dairy products.',
  }
}
