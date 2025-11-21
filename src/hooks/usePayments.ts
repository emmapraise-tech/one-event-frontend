import { useMutation } from '@tanstack/react-query';
import { paymentService } from '@/services/payment.service';
import { CreatePaymentData } from '@/types/payment';

export function useCreatePayment() {
  const createPaymentMutation = useMutation({
    mutationFn: paymentService.create,
  });

  return {
    createPayment: createPaymentMutation.mutate,
    isCreating: createPaymentMutation.isPending,
    payment: createPaymentMutation.data,
    error: createPaymentMutation.error,
  };
}

