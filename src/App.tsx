import { useState } from 'react'
import {
  AppShell,
  Button,
  Container,
  Title,
  Stack,
  Card,
  Text,
  Center,
  Loader,
  Alert,
  Group,
  Paper,
  rem,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconScan, IconInfoCircle, IconX } from '@tabler/icons-react'
import BarcodeScanner from './components/BarcodeScanner'
import NutritionFacts from './components/NutritionFacts'
import { getNutritionData } from './services/nutritionApi'
import './App.css'

export interface Product {
  product_name: string
  brands: string
  image_url: string
  nutriments: {
    'energy-kcal_100g': number
    'fat_100g': number
    'saturated-fat_100g': number
    'carbohydrates_100g': number
    'sugars_100g': number
    'fiber_100g': number
    'proteins_100g': number
    'salt_100g': number
    'sodium_100g': number
  }
  nutrition_grades: string
  ingredients_text: string
}

function App() {
  const [isScanning, setIsScanning] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [product, setProduct] = useState<Product | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleScanStart = () => {
    setIsScanning(true)
    setProduct(null)
    setError(null)
  }

  const handleScanResult = async (barcode: string) => {
    setIsScanning(false)
    setIsLoading(true)
    setError(null)

    try {
      const productData = await getNutritionData(barcode)
      if (productData) {
        setProduct(productData)
        notifications.show({
          title: 'Product Found!',
          message: `Found ${productData.product_name}`,
          color: 'green',
        })
      } else {
        setError('Product not found. Please try scanning again.')
        notifications.show({
          title: 'Product Not Found',
          message: 'This product is not in our database.',
          color: 'red',
        })
      }
    } catch {
      setError('Failed to fetch product data. Please try again.')
      notifications.show({
        title: 'Error',
        message: 'Failed to fetch product data',
        color: 'red',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleScanError = (error: string) => {
    setIsScanning(false)
    setError(error)
    notifications.show({
      title: 'Scan Error',
      message: error,
      color: 'red',
    })
  }

  const handleScanCancel = () => {
    setIsScanning(false)
  }

  const handleReset = () => {
    setProduct(null)
    setError(null)
  }

  return (
    <AppShell
      header={{ height: 60 }}
      padding="md"
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--mantine-color-gray-0)',
      }}
    >
      <AppShell.Header>
        <Container size="sm" h="100%">
          <Group h="100%" justify="space-between">
            <Title order={2} c="blue">
              Carbs Are Here
            </Title>
            {(product || error) && (
              <Button
                variant="light"
                size="sm"
                onClick={handleReset}
                leftSection={<IconX size={16} />}
              >
                Reset
              </Button>
            )}
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Main>
        <Container size="sm" py="xl">
          {isScanning && (
            <BarcodeScanner
              onResult={handleScanResult}
              onError={handleScanError}
              onCancel={handleScanCancel}
            />
          )}

          {!isScanning && !product && !isLoading && (
            <Stack align="center" gap="xl" mt="xl">
              <Paper
                radius="xl"
                p="xl"
                bg="gradient-to-r from-blue-500 to-purple-600"
                style={{ textAlign: 'center' }}
              >
                <Title order={1} c="white" mb="md">
                  🥗 Carbs Are Here
                </Title>
                <Text c="white" size="lg" mb="xl">
                  Scan any food barcode to get instant nutrition facts
                </Text>
                <Button
                  size="xl"
                  variant="white"
                  radius="xl"
                  leftSection={<IconScan size={24} />}
                  onClick={handleScanStart}
                  style={{
                    fontSize: rem(18),
                    fontWeight: 600,
                    padding: `${rem(16)} ${rem(32)}`,
                  }}
                >
                  Scan Barcode
                </Button>
              </Paper>

              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Stack gap="sm">
                  <Group>
                    <IconInfoCircle size={20} color="blue" />
                    <Text fw={500}>How it works</Text>
                  </Group>
                  <Text size="sm" c="dimmed">
                    1. Tap the "Scan Barcode" button
                  </Text>
                  <Text size="sm" c="dimmed">
                    2. Point your camera at a food barcode
                  </Text>
                  <Text size="sm" c="dimmed">
                    3. Get instant nutrition facts and ingredient information
                  </Text>
                </Stack>
              </Card>
            </Stack>
          )}

          {isLoading && (
            <Center mt="xl">
              <Stack align="center" gap="md">
                <Loader size="lg" />
                <Text>Loading nutrition data...</Text>
              </Stack>
            </Center>
          )}

          {error && (
            <Alert
              icon={<IconInfoCircle size={16} />}
              title="Error"
              color="red"
              mt="md"
            >
              {error}
            </Alert>
          )}

          {product && <NutritionFacts product={product} />}
        </Container>
      </AppShell.Main>
    </AppShell>
  )
}

export default App
