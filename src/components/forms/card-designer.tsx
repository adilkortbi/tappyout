'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as fabric from 'fabric';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Upload, Download, Move, Square } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CardDesignerProps {
  cardTemplate?: string;
  onDesignChange?: (design: object) => void;
  onSaveAndContinue?: () => void;
}

export function CardDesigner({ cardTemplate = 'standard', onDesignChange, onSaveAndContinue }: CardDesignerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);
  const [nfcLink, setNfcLink] = useState<string>('');
  const [urlError, setUrlError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: 400,
      height: 250,
      backgroundColor: "#ffffff",
    });

    // Add card template background image based on template
    const getBackgroundImage = (template: string) => {
      switch (template) {
        case 'standard-white':
          return '/customizable-white.png';
        case 'premium-wood':
          return '/customizable-wood.png';
        default:
          return '/customizable-black.png';
      }
    };

    fabric.Image.fromURL(getBackgroundImage(cardTemplate)).then((img) => {
      img.set({
        left: 0,
        top: 0,
        scaleX: 400 / img.width!,
        scaleY: 250 / img.height!,
        selectable: false,
        evented: false,
      });
      fabricCanvas.add(img);
      fabricCanvas.renderAll();
    });

    // Example WiFi path (from Lucide)
    const wifiPath =
      "M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 0 1 1.06 0Z";

    const wifiIcon = new fabric.Path(wifiPath, {
      left: 340, // position bottom right
      top: 200,
      fill: "",
      stroke: "#ffffff",
      strokeWidth: 2,
      scaleX: 1.5,
      scaleY: 1.5,
      selectable: false,
      evented: false,
    });

    fabricCanvas.add(wifiIcon);

    setCanvas(fabricCanvas);

    fabricCanvas.on("selection:created", (e) => {
      setSelectedObject(e.selected?.[0] || null);
    });

    fabricCanvas.on("selection:updated", (e) => {
      setSelectedObject(e.selected?.[0] || null);
    });

    fabricCanvas.on("selection:cleared", () => {
      setSelectedObject(null);
    });

    return () => {
      fabricCanvas.dispose();
    };
  }, [cardTemplate]);


  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !canvas) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      
      fabric.Image.fromURL(result).then((img) => {
        // Scale image to fit nicely on card
        const maxWidth = 150;
        const maxHeight = 100;
        const scale = Math.min(maxWidth / img.width!, maxHeight / img.height!);
        
        // Center the logo on the canvas
        const centerX = (400 - (img.width! * scale)) / 2;
        const centerY = (250 - (img.height! * scale)) / 2;
        
        img.set({
          left: centerX,
          top: centerY,
          scaleX: scale,
          scaleY: scale,
          lockMovementX: true,
          lockMovementY: true,
          lockRotation: true,
          centeredRotation: false,
          centeredScaling: true,
        });

        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();

        if (onDesignChange) {
          onDesignChange(canvas.toJSON());
        }

        toast({
          title: "Logo uploaded successfully",
          description: "You can now position and resize your logo on the card.",
        });
      });
    };

    reader.readAsDataURL(file);
  };

  const handleDownloadPreview = () => {
    if (!canvas) return;

    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2,
    });

    const link = document.createElement('a');
    link.download = 'nfc-card-preview.png';
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Preview downloaded",
      description: "Your card preview has been saved.",
    });
  };

  const handleSaveAndContinue = () => {
    if (!canvas) return;
    
    if (!nfcLink.trim()) {
      setUrlError('Please enter a valid URL for your NFC card.');
      return;
    }
    
    // Clear any previous error
    setUrlError('');

    const designData = {
      canvas: canvas.toJSON(),
      nfcLink: nfcLink.trim(),
    };
    
    if (onDesignChange) {
      onDesignChange(designData);
    }

    toast({
      title: "Design saved successfully",
      description: "Your card design and NFC link have been saved.",
    });

    // Scroll to add-to-cart section
    if (onSaveAndContinue) {
      onSaveAndContinue();
    }
  };

  const deleteSelected = () => {
    if (!canvas || !selectedObject) return;

    canvas.remove(selectedObject);
    canvas.renderAll();
    setSelectedObject(null);

    if (onDesignChange) {
      onDesignChange(canvas.toJSON());
    }
  };


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Square className="h-5 w-5" />
            Card Designer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Canvas */}
          <div className="flex justify-center">
            <div className="border rounded-lg p-4 bg-muted/30">
              <canvas 
                ref={canvasRef}
                className="border rounded shadow-sm"
              />
            </div>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Upload Section */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Upload Logo</Label>
              <div className="space-y-3">
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Logo File
                </Button>
                <p className="text-xs text-muted-foreground">
                  Supports PNG, JPG, and SVG files up to 5MB
                </p>
              </div>
            </div>

            {/* Object Controls */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Remove Logo</Label>
              <Button
                onClick={deleteSelected}
                disabled={!selectedObject}
                variant="outline"
                size="sm"
                className="w-full"
              >
                Delete
              </Button>
            </div>
          </div>

          <Separator />

          {/* NFC Link */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">NFC Link</Label>
            <div className="space-y-2">
              <Input
                type="url"
                placeholder="https://your-website.com"
                value={nfcLink}
                onChange={(e) => {
                  setNfcLink(e.target.value);
                  if (urlError) setUrlError(''); // Clear error on typing
                }}
                className={`w-full ${urlError ? 'border-red-500 focus:border-red-500' : ''}`}
              />
              {urlError && (
                <p className="text-xs text-red-600 mt-1">
                  {urlError}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                This link will be programmed into your NFC card. When someone taps your card, they&apos;ll be directed to this URL. To share multiple links in one, we recommend creating a <a href="https://linktr.ee/" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">Linktree</a> account.
              </p>
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={handleDownloadPreview}
              variant="outline"
              className="flex-1"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Preview
            </Button>
            <Button onClick={handleSaveAndContinue} className="flex-1 bg-brand hover:bg-brand/90">
              Save Design & Continue
            </Button>
          </div>

          {/* Tips */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h4 className="font-medium text-sm">Design Tips:</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Keep logos simple and high contrast for best visibility</li>
              <li>• Use vector formats (SVG) for crisp printing at any size</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}