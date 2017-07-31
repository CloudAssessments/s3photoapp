# Other apps will be installed here when they exist
install:
	cd apps/photo-storage && npm install -q;

# Remove node_modules and generated files
clean:
	cd apps/photo-storage && rm -rf node_modules;

lint:
	cd apps/photo-storage && npm run lint .;

test:
	cd apps/photo-storage && npm test;

.PHONY: install