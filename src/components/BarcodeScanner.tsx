import React, { useCallback, useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import { BrowserMultiFormatReader } from "@zxing/library";
import {
  Button,
  Stack,
  Text,
  Paper,
  Group,
  ActionIcon,
  rem,
} from "@mantine/core";
import { IconX, IconCamera } from "@tabler/icons-react";

interface BarcodeScannerProps {
  onResult: (barcode: string) => void;
  onError: (error: string) => void;
  onCancel: () => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  onResult,
  onError,
  onCancel,
}) => {
  const webcamRef = useRef<Webcam>(null);
  const codeReader = useRef<BrowserMultiFormatReader | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const hasDetectedRef = useRef(false); // Flag to prevent multiple detections

  const videoConstraints = {
    width: { ideal: 1920 },
    height: { ideal: 1080 },
    facingMode: "environment", // Use back camera
  };

  const startScanning = useCallback(() => {
    if (!webcamRef.current?.video) return;

    setIsScanning(true);
    hasDetectedRef.current = false; // Reset detection flag
    codeReader.current = new BrowserMultiFormatReader();

    const scanBarcode = () => {
      if (!webcamRef.current?.video || !codeReader.current) return;

      codeReader.current
        .decodeFromVideoDevice(
          null,
          webcamRef.current.video,
          (result, error) => {
            if (result && !hasDetectedRef.current) {
              const barcode = result.getText();
              if (barcode) {
                hasDetectedRef.current = true; // Set flag to prevent multiple detections
                setIsScanning(false);

                // Stop the scanner and camera immediately
                if (codeReader.current) {
                  codeReader.current.reset();
                }

                // Stop the camera stream
                if (stream) {
                  stream.getTracks().forEach((track) => track.stop());
                  setStream(null);
                }

                onResult(barcode);
              }
            }
            if (error && error.name !== "NotFoundException") {
              console.error("Barcode scan error:", error);
            }
          }
        )
        .catch((err) => {
          console.error("Failed to start barcode scanning:", err);
          onError(
            "Failed to start barcode scanning. Please ensure camera permissions are granted."
          );
        });
    };

    // Start scanning after a small delay to ensure video is ready
    setTimeout(scanBarcode, 500);
  }, [onResult, onError, stream]);

  const stopScanning = useCallback(() => {
    setIsScanning(false);
    hasDetectedRef.current = false; // Reset detection flag
    if (codeReader.current) {
      codeReader.current.reset();
      codeReader.current = null;
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }, [stream]);

  const handleUserMedia = useCallback(
    (mediaStream: MediaStream) => {
      setStream(mediaStream);
      // Start scanning when camera is ready
      setTimeout(() => {
        startScanning();
      }, 500);
    },
    [startScanning]
  );

  useEffect(() => {
    // Reset detection flag when component mounts
    hasDetectedRef.current = false;
  }, []);

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, [stopScanning]);

  // Additional cleanup when component unmounts or scanning stops
  useEffect(() => {
    if (!isScanning && stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }, [isScanning, stream]);

  const handleCancel = () => {
    stopScanning();
    onCancel();
  };

  return (
    <Stack gap="md">
      <Paper
        radius="md"
        p="md"
        style={{
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#000",
          minHeight: "60vh",
        }}
      >
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          onUserMedia={handleUserMedia}
          onUserMediaError={(error) => {
            console.error("Camera error:", error);
            onError("Failed to access camera. Please check permissions.");
          }}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: rem(8),
          }}
        />

        {/* Scanning overlay */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "250px",
            height: "150px",
            border: "2px solid #fff",
            borderRadius: "8px",
            boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.5)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-2px",
              left: "-2px",
              width: "20px",
              height: "20px",
              borderTop: "4px solid #4c6ef5",
              borderLeft: "4px solid #4c6ef5",
              borderRadius: "4px 0 0 0",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "-2px",
              right: "-2px",
              width: "20px",
              height: "20px",
              borderTop: "4px solid #4c6ef5",
              borderRight: "4px solid #4c6ef5",
              borderRadius: "0 4px 0 0",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-2px",
              left: "-2px",
              width: "20px",
              height: "20px",
              borderBottom: "4px solid #4c6ef5",
              borderLeft: "4px solid #4c6ef5",
              borderRadius: "0 0 0 4px",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-2px",
              right: "-2px",
              width: "20px",
              height: "20px",
              borderBottom: "4px solid #4c6ef5",
              borderRight: "4px solid #4c6ef5",
              borderRadius: "0 0 4px 0",
            }}
          />
        </div>

        {/* Close button */}
        <ActionIcon
          variant="filled"
          color="red"
          size="lg"
          radius="xl"
          onClick={handleCancel}
          style={{
            position: "absolute",
            top: rem(16),
            left: rem(16),
          }}
        >
          <IconX size={20} />
        </ActionIcon>
      </Paper>

      <Stack gap="sm" align="center">
        <Text size="lg" fw={500} ta="center">
          Position the barcode within the frame
        </Text>
        <Text size="sm" c="dimmed" ta="center">
          Hold your device steady and ensure the barcode is clearly visible
        </Text>
        <Group justify="center" mt="md">
          <Button
            variant="light"
            size="lg"
            leftSection={<IconCamera size={20} />}
            onClick={startScanning}
            disabled={isScanning}
          >
            {isScanning ? "Scanning..." : "Retry Scan"}
          </Button>
          <Button variant="outline" size="lg" onClick={handleCancel}>
            Cancel
          </Button>
        </Group>
      </Stack>
    </Stack>
  );
};

export default BarcodeScanner;
