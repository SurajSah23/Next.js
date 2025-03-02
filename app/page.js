"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { MapPin, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

export default function Home() {
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCompare = async () => {
    if (!address1 || !address2) {
      setError("Both addresses are required");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch("/api/compare-addresses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address1, address2 }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to compare addresses");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Address Comparison Tool</h1>
          <p className="text-muted-foreground">
            Compare two addresses to determine if they refer to the same location
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Enter Addresses</CardTitle>
            <CardDescription>
              Provide two addresses to compare using Gemini AI
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="address1" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> First Address
              </Label>
              <Input
                id="address1"
                placeholder="123 Main St, Anytown, CA 12345"
                value={address1}
                onChange={(e) => setAddress1(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address2" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Second Address
              </Label>
              <Input
                id="address2"
                placeholder="123 Main Street, Anytown, California 12345"
                value={address2}
                onChange={(e) => setAddress2(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleCompare} 
              disabled={loading || !address1 || !address2}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Comparing...
                </>
              ) : (
                "Compare Addresses"
              )}
            </Button>
          </CardFooter>
        </Card>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Comparison Result
                <Badge variant={result.match ? "default" : "secondary"}>
                  {result.match ? "Match" : "No Match"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Confidence Level</span>
                  <span className="text-sm font-medium">{Math.round(result.confidence * 100)}%</span>
                </div>
                <Progress value={result.confidence * 100} className="h-2" />
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Explanation</h3>
                <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                  {result.explanation}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-muted p-3 rounded-md">
                  <p className="text-xs text-muted-foreground mb-1">Address 1</p>
                  <p className="text-sm">{address1}</p>
                </div>
                <div className="bg-muted p-3 rounded-md">
                  <p className="text-xs text-muted-foreground mb-1">Address 2</p>
                  <p className="text-sm">{address2}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
