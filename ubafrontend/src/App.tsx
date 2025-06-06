import "./index.css";
import React from 'react';
import AppRoutes from "./routes/AppRoutes";
import { Toast } from './utils/toast';

function App() {
  return (
    <>
      <AppRoutes />
      <Toast />
    </>
  );
}

export default App;
