INSERT INTO income (sub_id, amount, month, date)
VALUES ($1, $2, $3, $4)
returning *;