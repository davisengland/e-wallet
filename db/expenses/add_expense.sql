INSERT INTO expenses (sub_id, amount, month, category)
VALUES ($1, $2, $3, $4)
returning *;