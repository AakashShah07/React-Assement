export interface ListItem {
  id: string;
  name: string;
  scientific_name: string;
  list_number: number;
}

export interface List {
  id: number;
  name: string;
  items: ListItem[];
  isSelected: boolean;
}