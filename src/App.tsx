import { useState } from "react";
import * as iap from "@choochmeque/tauri-plugin-iap-api";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  
  const testGetProducts = async () => {
    try {
      setMessage("Testing getProducts...");
      
      // Initialize first
      await iap.initialize();
      setMessage("✅ IAP initialized, calling getProducts...");
      
      // Call with correct signature: getProducts(productIds: string[], productType?: "subs" | "inapp")
      const result = await iap.getProducts(
        ["com.test.product1", "com.test.subscription1"],
        "subs"
      );
      
      setMessage(`✅ getProducts succeeded!\n${JSON.stringify(result, null, 2)}`);
    } catch (error: any) {
      setMessage(`❌ getProducts error: ${error?.message || error}`);
      console.error("IAP getProducts Error:", error);
    }
  };
  
  const testPurchase = async () => {
    try {
      setMessage("Testing purchase...");
      
      // Initialize first
      await iap.initialize();
      setMessage("✅ IAP initialized, calling purchase...");
      
      // Call with correct signature: purchase(productId: string, productType?: "subs" | "inapp", options?: PurchaseOptions)
      const result = await iap.purchase("com.test.product1", "subs");
      
      setMessage(`✅ purchase succeeded!\n${JSON.stringify(result, null, 2)}`);
    } catch (error: any) {
      setMessage(`❌ purchase error: ${error?.message || error}`);
      console.error("IAP purchase Error:", error);
    }
  };

  return (
    <div className="container">
      <h1>IAP Plugin Test</h1>
      
      <div className="card">
        <button onClick={testGetProducts}>
          Get Products
        </button>
        <button onClick={testPurchase}>
          Purchase Product
        </button>
      </div>

      <pre style={{ 
        textAlign: 'left', 
        whiteSpace: 'pre-wrap', 
        wordWrap: 'break-word',
        maxWidth: '100%',
        fontSize: '12px'
      }}>
        {message}
      </pre>
    </div>
  );
}

export default App;
