  // generic filter function  by name
export const filterByName = <T extends { name: string }>(items: T[], name: string): T[] => {
  return items.filter(item => item.name === name)
}