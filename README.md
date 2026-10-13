# Iniciar o Aplicativo

## 1: Iniciar o Metro

Para habilitar o aplicativo a funcnionar em modo Debug, é preciso iniciar o `Metro`, uma ferramenta de `JavaScript` para `React Native`.

Para iniciar o `dev server` do **Metro**, o seguinte comando deve ser executado no terminal base do projeto:

```sh
npm start
```

## 2: Build e Run do Aplicativo

Com o **Metro** operando, abra um novo terminal/janela na base do projeto e execute o seguinte comando para construir o Debug em um Celular de acordo com o sistema operacional:

### Android

```sh
npm run android
```

### iOS

Para **IOS**, instalar as dependências `CocoaPods`.

> A primeira vez que criar um novo projeto, execute o `Ruby bundler` para instalar o **CocoaPods**:

```sh
bundle install
```

> Para cada alteração/mudança das dependências do projeto, executar antes de tentar colocar em funcionamento:

```sh
bundle exec pod install
```

Para então:

```sh
npm run ios
```
