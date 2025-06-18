CREATE SEQUENCE sku_sequence START 1;


CREATE OR REPLACE FUNCTION generate_sku()
RETURNS TRIGGER AS $$
BEGIN
  NEW.sku := LPAD(nextval('sku_sequence')::text, 5, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_sku
BEFORE INSERT ON "public"."products"
FOR EACH ROW
EXECUTE FUNCTION generate_sku();
