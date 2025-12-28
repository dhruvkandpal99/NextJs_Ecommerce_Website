import mongoose, { Schema, model, models, Document } from 'mongoose';

export interface IOrder extends Document {
  productId: mongoose.Types.ObjectId;
  productName: string; // Store snapshot of name in case product is deleted
  amount: number;
  status: 'PENDING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  category: string; // Needed for the pie chart
  createdAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    productName: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { 
      type: String, 
      enum: ['PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED'], 
      default: 'PENDING' 
    },
    category: { type: String, required: true },
  },
  { timestamps: true }
);

const Order = models.Order || model<IOrder>('Order', OrderSchema);
export default Order;