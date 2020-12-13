export interface IRoute {
  children?: ((params: any) => React.ReactNode) | React.ReactNode;
  path: string;
  component: React.ComponentType;
  props?: any;
  addKey?: boolean | string[];
}
