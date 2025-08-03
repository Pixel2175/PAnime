build:
	npx cap sync && \
	npm run build && \
	npx cap copy android

debug: build
	cd android && ./gradlew assembleDebug && \
	cd ..

release: build
	cd android && ./gradlew assembleRelease && \
	cd ..
