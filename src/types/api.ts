export type ApiResponse = {
    status: 'error' | 'success'
    code: number
    error?: string
    data?: string
}
