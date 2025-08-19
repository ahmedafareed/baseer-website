-- Insert the "wessam" coupon with a 10% discount
INSERT INTO coupons (code, discount_percentage, valid_from, valid_until, is_active)
VALUES (
  'wessam',
  10.00,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP + INTERVAL '1 year',
  TRUE
);

