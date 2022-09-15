export interface IAgiIntranetCompanyPolicyProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  context: { pageContext: { web: { absoluteUrl: string; }; }; };
}
