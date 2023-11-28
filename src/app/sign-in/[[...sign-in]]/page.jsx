import { SignIn } from '@clerk/nextjs';
import Image from 'next/image';

const SignInPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50">
      <Image src="/img/KokuaLogo.png" alt="Kokua Logo" width={200} height={200} className='mb-5' />
      <SignIn appearance={{
        "layout": {
          "socialButtonsVariant": "iconButton"
        },
        "variables": {
          "colorPrimary": "#000000"
        },
        "elements": {
          "card": {
            "boxShadow": "10px",
            "backgroundColor": "white"
          },
          "headerTitle": {
            "fontFamily": "Merriweather",
            "fontWeight": 700,
            "fontSize": "24px",
            "lineHeight": "30px",
            "color": "#000000"
          },
          "headerSubtitle": {
            "fontFamily": "\"Merriweather Sans\", sans-serif",
            "fontStyle": "normal",
            "fontWeight": 300,
            "fontSize": "14px",
            "lineHeight": "20px",
            "color": "rgba(0, 0, 0, 0.65)"
          },
          "logoBox": {
            "display": "flex",
            "flexDirection": "row",
            "padding": 0,
            "gap": "4px"
          },
          "logoImage": {
            "filter": "brightness(0%)",
            "width": "76.5px",
            "height": "24px"
          },
          "socialButtons": {
            "backgroundColor": "white"
          },
          "formButtonPrimary": {
            "background": "#000000",
            "borderRadius": "6px",
            "fontFamily": "Merriweather",
            "letterSpacing": "0.5px",
            "color": "#FFFFFF",
            "textTransform": "none",
            "fontWeight": 700,
            "fontSize": "12px",
            "lineHeight": "16px"
          },
          "formFieldLabel": {
            "padding": "0px 0px 4px",
            "gap": "2px",
            "fontFamily": "Merriweather"
          },
          "formFieldInput": {
            "border": "1px solid #000000 !important",
            "borderRadius": "6px",
            "display": "flex",
            "flexDirection": "row",
            "alignItems": "flex-start",
            "padding": "10px 10px 10px 16px",
            "gap": "8px"
          },
          footer: {
            display: 'none',
          },
          "footerActionLink": {
            "width": "45px",
            "height": "15px",
            "fontFamily": "Merriweather",
            "fontStyle": "normal",
            "fontWeight": 400,
            "fontSize": "12px",
            "lineHeight": "15px",
            "textDecorationLine": "underline",
            "color": "#000000"
          },
          "footerActionText": {
            "width": "71px",
            "height": "15px",
            "fontFamily": "\"Merriweather Sans\", sans-serif",
            "fontStyle": "normal",
            "fontWeight": 300,
            "fontSize": "12px",
            "lineHeight": "15px",
            "color": "rgba(0, 0, 0, 0.65)"
          }
        }
      }} />
    </div>
  );
};

export default SignInPage;
