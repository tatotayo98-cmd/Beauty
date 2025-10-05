/*
  # Add PayPal fields to orders table

  1. Changes
    - Add `paypal_order_id` column to store PayPal order ID
    - Add `paypal_capture_id` column to store PayPal capture ID

  2. Notes
    - These fields are used to track PayPal payment status
    - Both fields are nullable as not all orders use PayPal
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'paypal_order_id'
  ) THEN
    ALTER TABLE orders ADD COLUMN paypal_order_id text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'paypal_capture_id'
  ) THEN
    ALTER TABLE orders ADD COLUMN paypal_capture_id text;
  END IF;
END $$;
