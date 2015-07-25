NODE_BIN_DIR=./node_modules/.bin

ts_files:=$(shell $(NODE_BIN_DIR)/tsproject inputs)
compiled_ts_files:=$(shell $(NODE_BIN_DIR)/tsproject outputs)

dist/main-bundle.js: $(compiled_ts_files)
	webpack

# http://stackoverflow.com/a/10609434/434243
$(compiled_ts_files): ts.intermediate
.INTERMEDIATE: ts.intermediate

ts.intermediate: $(ts_files)
	$(NODE_BIN_DIR)/tsc 
	$(NODE_BIN_DIR)/babel build/ts --out-dir build/js

run: $(compiled_ts_files)
	node $<

watch:
	$(NODE_BIN_DIR)/tsc --watch&
	$(NODE_BIN_DIR)/babel --watch build/ts --out-dir build/js&
	$(NODE_BIN_DIR)/webpack --watch&

clean:
	rm -rf build dist

format:
	$(NODE_BIN_DIR)/format-typescript-source

//.SILENT:
