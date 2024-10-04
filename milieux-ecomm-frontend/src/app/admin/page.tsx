"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useStoreContext } from "@/contexts/StoreContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AdminTopBar from "@/components/AdminTopBar";
import AdminOrders from "@/components/AdminOrders";
import PageCustomize from "@/components/PageCustomize";
import CustomizeProducts from "@/components/Customization/CustomizeProducts";

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  description: string;
  imgurl: string;
  store_id: number;
}

const Admin: React.FC = () => {
  const { storeInfo, loading, authToken } = useStoreContext();
  const [isAddItemClicked, setIsAddItemClicked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ecommBackend = process.env.NEXT_PUBLIC_ECOMM_BACKEND_URL;
  const PORT = ecommBackend ? process.env[ecommBackend] : "http://localhost:8080/ecomm/api" ;
  const [totalOrders, setTotalOrders] = useState(0);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showOrders, setShowOrders] = useState(false);
  const [showAllItems, setShowAllItems] = useState(true);
  const [showCustomization, setShowCustomization] = useState(false);

  const fetchTotalOrders = async () => {
    try {
      const response = await fetch(`${PORT}/order/total/${storeInfo.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      const text = await response.text();
      if (!response.ok) {
        throw new Error("Failed to fetch total orders");
      }
      const data = JSON.parse(text);
      setTotalOrders(data);
    } catch (error) {
      console.error("Error fetching total orders:", error);
      setError("Failed to fetch total orders");
    }
  };

  useEffect(() => {
    if (storeInfo) {
      fetchTotalOrders();
    }
  }, [storeInfo]);

  const refreshProducts = () => {
    console.log("refreshProducts called"); // Add this log to ensure the function is invoked
    setShowAllItems(false); // Temporarily hide AllProducts
    setTimeout(() => {
      console.log("Re-displaying AllProducts");
      setShowAllItems(true); // Re-show it to trigger useEffect in AllProducts
    }, 1); // Small delay to trigger re-render
  };

  const handleAddItemClick = () => {
    setIsAddItemClicked(!isAddItemClicked);
  };

  const handleShowItems = () => {
    setShowAllItems(true);
    setShowOrders(false);
    setShowCustomization(false);
  };

  const handleShowOrders = () => {
    setShowAllItems(false);
    setShowOrders(true);
    setShowCustomization(false);
  };

  const handleCustomization = () => {
    setShowAllItems(false);
    setShowOrders(false);
    setShowCustomization(true);
  };

  const onProductAdded = (newProduct: Product) => {
    refreshProducts(); // Trigger refresh after adding the product
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!storeInfo) {
    return <div>Error loading store information</div>;
  }

  return (
    <div className="flex flex-col px-10 gap-5 justify-between">
      <AdminTopBar name={storeInfo.name} headerLogo={storeInfo.logo_url} />
      <div className="flex flex-row gap-2">
        <Card className="flex flex-col justify-start items-start gap-5 border-0 rounded-xl px-10 shadow-none w-max font-normal text-xl">
          <Button
            onClick={handleShowItems}
            className="p-2 border-1 rounded-md w-[100%] text-gray-600 hover:bg-white hover:text-gray-900"
            variant={"ghost"}
          >
            Manage Products
          </Button>
          <Button
            onClick={handleShowOrders}
            className="p-2 border-1 rounded-md w-[100%] text-gray-600 hover:bg-white hover:text-gray-900"
            variant={"ghost"}
          >
            Manage Orders
          </Button>
          <Button
            onClick={handleCustomization}
            className="p-2 border-1 rounded-md w-[100%] text-gray-600 hover:bg-white hover:text-gray-900"
            variant={"ghost"}
          >
            Customize Shop
          </Button>
        </Card>

        <div className="flex gap-2 w-full">
          <div className="w-[70%]">
            {showAllItems && (
              <>
                <CustomizeProducts />
              </>
            )}
            {showOrders && (
              <>
                <div className="flex gap-5 w-full px-5">
                  <AdminOrders />
                </div>
              </>
            )}
            {showCustomization && (
              <>
                <div className="flex gap-5 w-full px-5">
                  <PageCustomize />
                </div>
              </>
            )}
          </div>

          <div
            className="flex flex-col gap-2 justify-center items-center"
            suppressHydrationWarning
          >
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Total Orders</CardTitle>
                <CardDescription>
                  Number of total orders made to the store
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl">{totalOrders}</p>
              </CardContent>
              <CardFooter>
                <Button onClick={handleShowOrders} variant={"ghost"}>
                  View Orders
                </Button>
              </CardFooter>
            </Card>

            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
