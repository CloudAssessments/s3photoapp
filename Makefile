clean:
	cd apps/photo-storage && npm run clean;
	cd apps/web-client && npm run clean;

install:
	cd apps/photo-storage && npm install -q;
	cd apps/web-client && npm install -q;

lint:
	cd apps/photo-storage && npm run lint .;
	cd apps/web-client && npm run lint .;

test:
	cd apps/photo-storage && npm test;
	cd apps/web-client && npm test;

.PHONY: clean install lint test