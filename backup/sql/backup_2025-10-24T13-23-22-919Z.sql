INSERT INTO users (id, username, password, is_regulator, regulator_balance, last_nft_generation, nft_generation_count) VALUES
;

INSERT INTO cards (id, user_id, type, number, expiry, cvv, balance, btc_balance, eth_balance, btc_address, eth_address) VALUES
;

INSERT INTO transactions (id, from_card_id, to_card_id, amount, converted_amount, type, wallet, status, created_at, description, from_card_number, to_card_number) VALUES
;

INSERT INTO exchange_rates (id, usd_to_uah, btc_to_usd, eth_to_usd, updated_at) VALUES
(1, 40.5, 65000, 3500, '2025-10-24T13:18:17.399Z'),
(2, 41.892862, 111268, 3969.58, '2025-10-24T13:18:45.822Z'),
(3, 40.5, 65000, 3500, '2025-10-24T13:18:48.246Z'),
(4, 41.892862, 111268, 3969.58, '2025-10-24T13:19:14.888Z'),
(5, 41.892862, 111289, 3970.53, '2025-10-24T13:19:50.219Z'),
(6, 40.5, 65000, 3500, '2025-10-24T13:19:52.676Z'),
(7, 41.892862, 111289, 3970.53, '2025-10-24T13:20:19.605Z'),
(8, 41.892862, 111289, 3970.53, '2025-10-24T13:20:50.132Z'),
(9, 40.5, 65000, 3500, '2025-10-24T13:20:53.873Z'),
(10, 41.892862, 111289, 3970.53, '2025-10-24T13:21:19.604Z'),
(11, 41.892862, 111289, 3970.53, '2025-10-24T13:21:49.604Z'),
(12, 41.892862, 111289, 3970.53, '2025-10-24T13:22:19.604Z'),
(13, 41.892862, 111340, 3973.35, '2025-10-24T13:22:51.244Z'),
(14, 40.5, 65000, 3500, '2025-10-24T13:22:53.663Z');
