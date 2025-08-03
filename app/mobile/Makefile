build:
	npm run build && \
	npx cap sync && \
	npx cap copy android

debug: build
	cd android && ./gradlew assembleDebug

release: build
	cd android && ./gradlew assembleRelease
