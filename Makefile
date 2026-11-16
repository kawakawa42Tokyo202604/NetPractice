NODE ?= node

.PHONY: test
test:
	$(NODE) tests/check_levels.js
