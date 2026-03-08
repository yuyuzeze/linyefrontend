export interface DemoItem {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
}

export interface CreateDemoItem {
  name: string;
  description: string | null;
}

export interface UpdateDemoItem {
  name: string;
  description: string | null;
}
