# massone-mobile

# Xcode >= 11

https://github.com/facebook/react-native/pull/25146/files

node_modules/react-native/React/Base/RCTModuleMethod.mm#RCTParseUnused

```c++
static BOOL RCTParseUnused(const char **input)
{
  return RCTReadString(input, "__unused") ||
         RCTReadString(input, "__attribute__((__unused__))") ||
         RCTReadString(input, "__unused") ||
         RCTReadString(input, "__attribute__((unused))");

}
```
