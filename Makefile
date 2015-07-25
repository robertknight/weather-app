NODE_BIN_DIR=./node_modules/.bin

dist/main-bundle.js: build/js/main.js build/js/weather.js
	webpack

build/js/weather.js build/js/main.js: main.tsx weather.ts
	$(NODE_BIN_DIR)/tsc 
	$(NODE_BIN_DIR)/babel build/ts --out-dir build/js

run: build/js/weather.js
	node $<

watch:
	$(NODE_BIN_DIR)/tsc --watch&
	$(NODE_BIN_DIR)/babel --watch build/ts --out-dir build/js&
	$(NODE_BIN_DIR)/webpack --watch&

clean:
	rm -rf build dist

.SILENT:
