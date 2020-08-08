export default interface ITokenStore {
  save(token: string): void
  get(token: string): Promise<string>
}
