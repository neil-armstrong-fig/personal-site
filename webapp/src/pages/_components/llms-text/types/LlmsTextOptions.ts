import type {LlmsLink} from "@src/pages/_components/llms-text/types/LlmsLink";
import type {LlmsProfile} from "@src/pages/_components/llms-text/types/LlmsProfile";

export interface LlmsTextOptions {
  name: string;
  description: string;
  caseStudies: readonly LlmsLink[];
  projects: readonly LlmsLink[];
  profiles: readonly LlmsProfile[];
}
