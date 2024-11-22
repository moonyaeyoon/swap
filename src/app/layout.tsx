// src/app/layout.tsx
import '../styles/globals.css';

// 폰트 관련 코드 제거 후 레이아웃 컴포넌트를 유지
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <html lang="en">
      <body>
      {children}
      </body>
      </html>
  );
}
