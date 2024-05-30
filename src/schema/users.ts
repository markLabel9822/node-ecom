import { z } from 'zod'

export const SignUpSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6)

})

export const AddressSchema = z.object({
   lineOne: z.string(),
   lineTwo: z.string().nullable(),
   pincode: z.string().length(6), //เรากำหนดไว้ 6 ตัว
   country: z.string(),
   city: z.string(),
   userId :  z.number(),

})



export const updateUserSchema = z.object({
    name: z.string().optional(),
    defaultShippingAddress: z.number().optional(),
    defaultBillingAddress: z.number().optional()
})