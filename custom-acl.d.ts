export declare class AclNode {
  name: string;
  parent: AclNode | null;
  private #config: Record<string, any>;
  private #colorDot?: RELATION_TYPE;
  private #children: AclNode[];
  private #merge: ((config: Record<string, any>, newConfig: Record<string, any>) => void) | null;
  private #diff: ((config: Record<string, any>, newConfig: Record<string, any>) => Record<string, any>) | null;
  private #onUpdate: () => void;

  constructor(options: {
    config?: Record<string, any>;
    name?: string;
    merge?: (config: Record<string, any>, newConfig: Record<string, any>) => void;
    diff?: (config: Record<string, any>, newConfig: Record<string, any>) => Record<string, any>;
    onUpdate?: () => void;
  });

  setParent(node: AclNode): void;
  appendChildren(node: AclNode): void;
  removeChild(node: AclNode): void;
  update(newConfig: Record<string, any>): void;
  get dotColor(): RELATION_TYPE;
  recalcDot();
  calcRelation(): RELATION_TYPE;
  recalcColorDot(): void;
  get config(): Record<string, any>;
  set config(value: Record<string, any>);
  updateChildren(cfg?: Record<string, any>): void;
}

declare enum RELATION_TYPE {
  SUBSET = 'red',
  SUPERSET = 'blue',
  OVERLAPPING = 'red-blue',
  EQUAL = '',
}

export default AclNode
export = AclNode
