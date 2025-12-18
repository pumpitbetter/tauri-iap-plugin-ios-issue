import { useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  
  const testGetProducts = async () => {
    try {
      setMessage("Testing getProducts...");
      
      // @ts-ignore - plugin may not have types
      const iap = window.__TAURI__?.plugins?.iap;
      
      if (!iap) {
        setMessage("❌ IAP plugin not found on window.__TAURI__");
        return;
      }
      
      setMessage("✅ IAP plugin found, calling getProducts...");
      
      const products = await iap.getProducts({
        productIds: ["com.test.product1", "com.test.subscription1"]
      });
      
      setMessage(`✅ getProducts succeeded!\n${JSON.stringify(products, null, 2)}`);
    } catch (error: any) {
      setMessage(`❌ getProducts error: ${error?.message || error}`);
      console.error("IAP getProducts Error:", error);
    }
  };
  
  const testPurchase = async () => {
    try {
      setMessage("Testing purchase...");
      
      // @ts-ignore - plugin may not have types
      const iap = window.__TAURI__?.plugins?.iap;
      
      if (!iap) {
        setMessage("❌ IAP plugin not found on window.__TAURI__");
        return;
      }
      
      setMessage("✅ IAP plugin found, calling purchase...");
      
      await iap.purchase({
        productId: "com.test.product1",
        type: "subscription"
      });
      
      setMessage("✅ Purchase called successfully!");
    } catch (error: any) {
      setMessage(`❌ Purchase error: ${error?.message || error}`);
      console.error("IAP Purchase Error:", error);
    }
  };

  return (
    <div className="container">
      <h1>Tauri IAP Plugin Test</h1>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
        <button onClick={testGetProducts}>
          Test getProducts()
        </button>
        
        <button onClick={testPurchase}>
          Test purchase()
        </button>
      </div>
      
      {message && (
        <div style={{ 
          marginTop: "20px", 
          padding: "10px", 
          border: "1px solid #ccc",
          whiteSpace: "pre-wrap",
          textAlign: "left",
          maxHeight: "400px",
          overflow: "auto"
        }}>
          {message}
        </div>
      )}
    </div>
  );
}

export default App;
