<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Registration;
use Illuminate\Http\Request;
use Razorpay\Api\Api;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;

class PaymentController extends Controller
{
    private Api $api;

    public function __construct()
    {
        $this->api = new Api(
            config('services.razorpay.key'),
            config('services.razorpay.secret')
        );
    }

    // 🔹 CREATE RAZORPAY ORDER
    public function createOrder(Request $request)
    {
        try {
            $order = $this->api->order->create([
                'amount'   => 500 * 100, // fixed amount
                'currency' => 'INR',
                'receipt'  => 'rcpt_' . time(),
            ]);

            return response()->json([
                'success'  => true,
                'order_id' => $order->id,
            ]);
        } catch (\Exception $e) {
            Log::error('Order Error: ' . $e->getMessage());
            return response()->json(['error' => 'Order creation failed'], 500);
        }
    }

    // 🔹 VERIFY PAYMENT + STORE USER + PAYMENT
    public function submitForm(Request $request)
    {
        $data = $request->validate([
            // User fields
            'mobile'   => 'required|regex:/^[0-9]{10}$/',
            'surname'  => 'required|string',
            'name'     => 'required|string',
            'dob'      => 'required|date',
            'gender'   => 'required|in:Male,Female',
            'email'    => 'required|email',
            'password' => 'required|string|min:8',
            'address'  => 'required|string',
            'state'    => 'required|string',
            'city'     => 'required|string',
            // 'pincode'  => 'required|string',
            'pincode' => 'required|digits:6',

            'ciap'     => 'nullable|string',

            // Razorpay
            'payment_id' => 'required|string',
            'order_id'   => 'required|string',
            'signature'  => 'required|string',
        ]);

        try {
            // ✅ Verify Razorpay signature
            $this->api->utility->verifyPaymentSignature([
                'razorpay_order_id'   => $data['order_id'],
                'razorpay_payment_id' => $data['payment_id'],
                'razorpay_signature'  => $data['signature'],
            ]);

            // ✅ Create or update user
            $user = Registration::create(
                [
                    'mobile'   => ltrim($data['mobile'], '0'),
                    'email' => $data['email'],
                    'surname'  => $data['surname'],
                    'name'     => $data['name'],
                    'dob'      => $data['dob'],
                    'gender'   => $data['gender'],
                    'password' => $data['password'],
                    'address'  => $data['address'],
                    'state'    => $data['state'],
                    'city'     => $data['city'],
                    'pincode'  => $data['pincode'],
                    'ciap'     => $data['ciap'],
                ]
            );

            // 🔐 Block duplicate successful payment
            $alreadyPaid = Payment::where('user_id', $user->id)
                ->where('status', 'success')
                ->exists();

            if ($alreadyPaid) {
                return response()->json([
                    'error' => 'Payment already completed for this user'
                ], 409);
            }

            // ✅ Store payment
            Payment::create([
                'user_id'    => $user->id,
                'amount'     => 500,
                'payment_id' => $data['payment_id'],
                'order_id'   => $data['order_id'],
                'signature'  => $data['signature'],
                'status'     => 'success',
                'paid_at'    => now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'User registered & payment successful',
                'user_id' => $user->id,
            ]);
        } catch (\Exception $e) {
            Log::error('Payment Error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Payment verification failed'
            ], 400);
        }
    }
}
