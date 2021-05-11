INSERT INTO budget (sub_id, amount, category)
VALUES ($1, $2, $3)
returning *;