import "./App.css"
import { AwesomeQRCode } from "@awesome-qrcode/react";

function App() {
  return (
    <main>
      <AwesomeQRCode
        value="This is an awesome QRCode!!"
        dataStyle="dots"
        size={175}
        eyeRadius={{
          inner: 0,
          outer: 6,
        }}
        logoImage="/logo.png"
        removeQrCodeBehindLogo
        logoPadding={2}
        logoHeight={40}
        logoWidth={40}
        logoOpacity={1}
      />
    </main>
  );
}

export default App;
