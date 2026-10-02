import * as React from "react";
import { SocialLinks } from "@/components/ui/social-links";

export function SocialLinksDemo() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-body">
      <SocialLinks
        links={[
          { platform: "facebook", href: "https://www.facebook.com/lapcircuit" },
          { platform: "linkedin", href: "https://www.linkedin.com/in/lapcircuit-off-b171b3440/" },
          { platform: "mail", href: "mailto:lapcircuitoff@gmail.com" },
          { platform: "whatsapp", href: "https://wa.me/94711249740" },
        ]}
      />
    </div>
  );
}

export default SocialLinksDemo;
