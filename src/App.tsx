import { useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  
  const testIAP = async () => {
    try {
      setMessage("Testing IAP plugin...");
      
      // @ts-ignore - plugin may not have types
      const iap = window.__TAURI__?.plugins?.iap;
      
      if (!iap) {
        setMessage("❌ IAP plugin not found on window.__TAURI__");
        return;
      }
      
      setMessage("✅ IAP plugin found, calling purchase...");
      
      await iap.purchase({
        productId: "test.product",
        type: "subscription"
      });
      
      setMessage("✅ Purchase called successfully!");
    } catch (error: any) {
      setMessage(`❌ Error: ${error?.message || error}`);
      console.error("IAP Error:", error);
    }
  };

  return (
    <div className="container">
      <h1>Tauri IAP Plugin Test</h1>
      
      <button onClick={testIAP}>
        Test Purchase Command
      </button>
      
      {message && (
        <div style={{ 
          marginTop: "20px", 
          padding: "10px", 
          border: "1px solid #ccc",
          whiteSpace: "pre-wrap"
        }}>
          {message}
        </div>
      )}
    </div>
  );
}

export default App;
