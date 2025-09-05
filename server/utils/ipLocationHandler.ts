// utils/ipLocationHandler.ts

// utils/ipLocationHandler.ts
export async function ipLocationHandler(ip: string): Promise<any> {
  return await $fetch(`http://ip-api.com/json/${ip}`)
}