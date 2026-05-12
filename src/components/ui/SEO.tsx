import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  type?: "website" | "article";
}

const defaultImage = "https://instarrumado.com.br/og-image.png";

const SEO = ({ title, description, image = defaultImage, type = "website" }: SEOProps) => {
  const location = useLocation();
  const url = `https://instarrumado.com.br${location.pathname}`;

  useEffect(() => {
    document.title = `${title} | Instarrumado`;

    const setMeta = (name: string, content: string, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let element = document.querySelector(selector) as HTMLMetaElement | null;

      if (!element) {
        element = document.createElement("meta");
        if (property) {
          element.setAttribute("property", name);
        } else {
          element.setAttribute("name", name);
        }
        document.head.appendChild(element);
      }

      element.setAttribute("content", content);
    };

    setMeta("description", description);
    setMeta("og:title", title, true);
    setMeta("og:description", description, true);
    setMeta("og:url", url, true);
    setMeta("og:image", image, true);
    setMeta("og:type", type, true);
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    setMeta("twitter:image", image);
  }, [title, description, image, type, url]);

  return null;
};

export default SEO;
