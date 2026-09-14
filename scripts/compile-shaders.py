"""Compile and link actual shader sources using a surfaceless GLES 3 context.
Requires Mesa/EGL; does not open a browser or measure the user's GPU.
"""
import ctypes as C
import json
import sys
E=C.CDLL('libEGL.so.1')
E.eglGetProcAddress.argtypes=[C.c_char_p];E.eglGetProcAddress.restype=C.c_void_p
getdisplay=C.CFUNCTYPE(C.c_void_p,C.c_uint,C.c_void_p,C.POINTER(C.c_int))(E.eglGetProcAddress(b'eglGetPlatformDisplayEXT'))
d=getdisplay(0x31DD,None,None)
E.eglInitialize.argtypes=[C.c_void_p,C.POINTER(C.c_int),C.POINTER(C.c_int)];E.eglInitialize.restype=C.c_uint
major=C.c_int();minor=C.c_int();assert E.eglInitialize(d,C.byref(major),C.byref(minor))
E.eglBindAPI.argtypes=[C.c_uint];assert E.eglBindAPI(0x30A0)
attrs=(C.c_int*13)(0x3033,1,0x3040,0x40,0x3024,8,0x3023,8,0x3022,8,0x3021,8,0x3038)
E.eglChooseConfig.argtypes=[C.c_void_p,C.POINTER(C.c_int),C.POINTER(C.c_void_p),C.c_int,C.POINTER(C.c_int)];config=C.c_void_p();num=C.c_int();assert E.eglChooseConfig(d,attrs,C.byref(config),1,C.byref(num)) and num.value
E.eglCreateContext.argtypes=[C.c_void_p,C.c_void_p,C.c_void_p,C.POINTER(C.c_int)];E.eglCreateContext.restype=C.c_void_p;ctx=E.eglCreateContext(d,config,None,(C.c_int*3)(0x3098,3,0x3038))
E.eglMakeCurrent.argtypes=[C.c_void_p,C.c_void_p,C.c_void_p,C.c_void_p];assert E.eglMakeCurrent(d,None,None,ctx)
def fn(name,result,*args):return C.CFUNCTYPE(result,*args)(E.eglGetProcAddress(name.encode()))
create=fn('glCreateShader',C.c_uint,C.c_uint)
source=fn('glShaderSource',None,C.c_uint,C.c_int,C.POINTER(C.c_char_p),C.POINTER(C.c_int))
compile_=fn('glCompileShader',None,C.c_uint)
get=fn('glGetShaderiv',None,C.c_uint,C.c_uint,C.POINTER(C.c_int))
log=fn('glGetShaderInfoLog',None,C.c_uint,C.c_int,C.POINTER(C.c_int),C.c_char_p)
program=fn('glCreateProgram',C.c_uint)
attach=fn('glAttachShader',None,C.c_uint,C.c_uint)
link=fn('glLinkProgram',None,C.c_uint)
getp=fn('glGetProgramiv',None,C.c_uint,C.c_uint,C.POINTER(C.c_int))
logp=fn('glGetProgramInfoLog',None,C.c_uint,C.c_int,C.POINTER(C.c_int),C.c_char_p)
delete=fn('glDeleteShader',None,C.c_uint);deletep=fn('glDeleteProgram',None,C.c_uint)
for item in json.load(open(sys.argv[1])):
 shaders=[]
 for kind,typ in [('vertex',0x8B31),('fragment',0x8B30)]:
  shader=create(typ);text=C.c_char_p(item[kind].encode());source(shader,1,C.byref(text),None);compile_(shader);ok=C.c_int();get(shader,0x8B81,C.byref(ok))
  if not ok.value:
   buf=C.create_string_buffer(16000);log(shader,len(buf),None,buf);raise RuntimeError(item['name']+' '+kind+': '+buf.value.decode())
  shaders.append(shader)
 p=program()
 for shader in shaders:attach(p,shader)
 link(p);ok=C.c_int();getp(p,0x8B82,C.byref(ok))
 if not ok.value:
  buf=C.create_string_buffer(16000);logp(p,len(buf),None,buf);raise RuntimeError(item['name']+' link: '+buf.value.decode())
 for shader in shaders:delete(shader)
 deletep(p)
 print('PASS GLSL ES 3 compile/link: '+item['name'])
E.eglMakeCurrent(d,None,None,None)
E.eglDestroyContext.argtypes=[C.c_void_p,C.c_void_p];E.eglDestroyContext(d,ctx)
E.eglTerminate.argtypes=[C.c_void_p];E.eglTerminate(d)
