---
layout: docs
title: Levitas
nav: projects
subnav: docs
project: levitas
---


# Overview


Levitas is a lightweight wsgi framework.

The main concept is the mapping between urls as regular expressions and a
corresponding python class. 
Levitas is designed to be simple to implement and extendable.

Levitas defines basic methods to handle headers, cookies, form data and query strings.
Configuration is easily made with a settings file. 

Levitas provides predefined ready to use classes for static files, json-rpc services,
redirection, logging and dynamic content. But programmers don't need to use them,
they can easily develop there own functionalities.

Levitas works with python 2.7 and python 3.x. No other dependencies are needed.


# Installation

[Download](/projects/levitas/downloads.html) and unpack the package or clone levitas from github.

```
cd levitas/src
python setup.py install
```


# Tutorial

This tutorial describes the basic steps to write a web application with levitas. 


## A simple levitas application

A small 'Hello World' application.

Define a middleware class:

```python
from levitas.middleware import Middleware

class MyMiddleware(Middleware):
	def get(self):
		return "Hello world!"
```
Copy the code above and save it in a file called
```myMiddleware.py```.

Define the settings file:

```python
from myMiddleware import MyMiddleware

urls = [(r"^/$", MyMiddleware)]
```
Copy the code above and save it in a file called
```settings.py```.

Start the application:

```
levitas-testserver -s settings
```

Call the url [http://localhost:8080/](http://localhost:8080/)
and you should get the ```Hello world!``` message.


### What is a middleware?

A middleware class inherits the Levitas
<a href="/api/levitas.middleware.Middleware-class.html" target="_blank">Middleware class</a>.
It defines the http methods **get**, **post**, **delete**, **put** and **head**. The inherited class
must override one or more of these methods and return the response for the request.

In the above example the **get** method returns a string ```Hello world!```.
The return type for the response can be a string, an iterable object or a file object.
 
The base middleware class provides several instance variables and methods, like the path of the
url or methods to get and set cookies. 


### What is a settings file?

A settings file is a python module, which defines the behaviour of the application.
The settings module is the entry point of the application and must be in the python path.
It defines the mapping between urls and middleware classes.
The mapping can be extended with positional and named parameters, to instantiate the
middleware.

In the above example, the path ```/``` is mapped to the ```MyMiddleware``` class.

Further configurations can be made in the settings file.
As example, the testing server can be configured to another port.
The settings file will then be:

```python
from myMiddleware import MyMiddleware

httpserver_address = ("127.0.0.1", 9876)

urls = [(r"^/$", MyMiddleware)]
```

The test server have an own settings variable ```httpserver_address``` defined.
Custom Middleware classes can define also there own settings variables.


## An application that uses regular expressions

Assuming you like to write a blog application that returns entries with a path 
structure like ```/blog/year/month/date``` (e.g. ```/blog/2014/04/13```).

The blog middleware:

```python
from levitas.middleware import Middleware

class BlogMiddleware(Middleware):
	def get(self):
		year, month, date = self.url_groups()
		return "Blog entry %s-%s-%s" % (year, month, date)
```
Copy the code above and save it in a file called
```blogMiddleware.py```.


The settings file:

```python
from blogMiddleware import BlogMiddleware

urls = [(r"^/blog/(\d{4})/(\d{2})/(\d{2})$", BlogMiddleware)]
```

Copy the code above and save it in a file called
```settings.py```.

Start the application:

```
levitas-testserver -s settings
```

Call the url [http://localhost:8080/blog/2014/04/13](http://localhost:8080/blog/2014/04/13)
and you should get the ```Blog entry 2014-04-13``` message.


### How regular expressions works

In the above example the pattern ```r"^/blog/(\d{4})/(\d{2})/(\d{2})$"``` defines,
that the BlogMiddleware will be called if the path begins with ```/blog``` and the further
path components are a 4 digits, 2 digits and 2 digits for year/month/day.

Levitas will set a [python match object](https://docs.python.org/3/library/re.html#match-objects)
to the instantiated BlogMiddleware which is setted to the instance variable ```re_match```.
The method ```url_groups()``` returns the groups of the match object.


## Positional and named arguments

The url defenitions can be extended with positional and/or named arguments.
The following example shows how this works:


```python
from levitas.middleware import Middleware


class MyHandler(object):

	def __init__(self, pos_arg, named_arg="value"):
		self.pos_arg = pos_arg
		self.named_arg = named_arg
		
	def get_result(self):
		return "Handler called with pos_arg '%s' and named_arg '%s'" \
				% (self.pos_arg, self.named_arg)
		
	
class MyMiddleware(Middleware):

	def __init__(self, handler_class, pos_arg, named_arg="value"):
		Middleware.__init__(self)
		self.handler_class = handler_class
		self.pos_arg = pos_arg
		self.named_arg = named_arg
		
	def get(self):
		handler = self.handler_class(self.pos_arg,
									 named_arg=self.named_arg)
		return handler.get_result()
```

Copy the code above and save it in a file called
```myMiddleware.py```.

Define the settings file:

```python
from myMiddleware import MyMiddleware, MyHandler

urls = [(r"^/.*$", MyMiddleware, MyHandler, "pos-arg-value",
								 {"named_arg": "named-arg-value"})]
```
Copy the code above and save it in a file called
```settings.py```.

Start the application:

```
levitas-testserver -s settings
```

Call the url [http://localhost:8080/](http://localhost:8080/) to see the result.


## Define own settings


# The Settings module


# Predefined middlewares


## Serving static files - FileMiddleware and AppMiddleware


## JSON-RPC services - JSONMiddleware


## Redirect urls - RedirectMiddleware


## Serving dynamic content - DynSiteMiddleware


## Receive and log messages - LoggerMiddleware


# Reference


## levitas.middleware.Middleware
 

## levitas.lib.settings


## levitas.handler.WSGIHandler


## levitas.signals


# License (Apache Licence 2.0)

```
	Apache License
	Version 2.0, January 2004
	http://www.apache.org/licenses/
	
	TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION
	
	1. Definitions.
	
	"License" shall mean the terms and conditions for use, reproduction, and
	distribution as defined by Sections 1 through 9 of this document.
	
	"Licensor" shall mean the copyright owner or entity authorized by the copyright
	owner that is granting the License.
	
	"Legal Entity" shall mean the union of the acting entity and all other entities
	that control, are controlled by, or are under common control with that entity.
	For the purposes of this definition, "control" means (i) the power, direct or
	indirect, to cause the direction or management of such entity, whether by
	contract or otherwise, or (ii) ownership of fifty percent (50%) or more of the
	outstanding shares, or (iii) beneficial ownership of such entity.
	
	"You" (or "Your") shall mean an individual or Legal Entity exercising
	permissions granted by this License.
	
	"Source" form shall mean the preferred form for making modifications, including
	but not limited to software source code, documentation source, and configuration
	files.
	
	"Object" form shall mean any form resulting from mechanical transformation or
	translation of a Source form, including but not limited to compiled object code,
	generated documentation, and conversions to other media types.
	
	"Work" shall mean the work of authorship, whether in Source or Object form, made
	available under the License, as indicated by a copyright notice that is included
	in or attached to the work (an example is provided in the Appendix below).
	
	"Derivative Works" shall mean any work, whether in Source or Object form, that
	is based on (or derived from) the Work and for which the editorial revisions,
	annotations, elaborations, or other modifications represent, as a whole, an
	original work of authorship. For the purposes of this License, Derivative Works
	shall not include works that remain separable from, or merely link (or bind by
	name) to the interfaces of, the Work and Derivative Works thereof.
	
	"Contribution" shall mean any work of authorship, including the original version
	of the Work and any modifications or additions to that Work or Derivative Works
	thereof, that is intentionally submitted to Licensor for inclusion in the Work
	by the copyright owner or by an individual or Legal Entity authorized to submit
	on behalf of the copyright owner. For the purposes of this definition,
	"submitted" means any form of electronic, verbal, or written communication sent
	to the Licensor or its representatives, including but not limited to
	communication on electronic mailing lists, source code control systems, and
	issue tracking systems that are managed by, or on behalf of, the Licensor for
	the purpose of discussing and improving the Work, but excluding communication
	that is conspicuously marked or otherwise designated in writing by the copyright
	owner as "Not a Contribution."
	
	"Contributor" shall mean Licensor and any individual or Legal Entity on behalf
	of whom a Contribution has been received by Licensor and subsequently
	incorporated within the Work.
	
	2. Grant of Copyright License.
	
	Subject to the terms and conditions of this License, each Contributor hereby
	grants to You a perpetual, worldwide, non-exclusive, no-charge, royalty-free,
	irrevocable copyright license to reproduce, prepare Derivative Works of,
	publicly display, publicly perform, sublicense, and distribute the Work and such
	Derivative Works in Source or Object form.
	
	3. Grant of Patent License.
	
	Subject to the terms and conditions of this License, each Contributor hereby
	grants to You a perpetual, worldwide, non-exclusive, no-charge, royalty-free,
	irrevocable (except as stated in this section) patent license to make, have
	made, use, offer to sell, sell, import, and otherwise transfer the Work, where
	such license applies only to those patent claims licensable by such Contributor
	that are necessarily infringed by their Contribution(s) alone or by combination
	of their Contribution(s) with the Work to which such Contribution(s) was
	submitted. If You institute patent litigation against any entity (including a
	cross-claim or counterclaim in a lawsuit) alleging that the Work or a
	Contribution incorporated within the Work constitutes direct or contributory
	patent infringement, then any patent licenses granted to You under this License
	for that Work shall terminate as of the date such litigation is filed.
	
	4. Redistribution.
	
	You may reproduce and distribute copies of the Work or Derivative Works thereof
	in any medium, with or without modifications, and in Source or Object form,
	provided that You meet the following conditions:
	
	You must give any other recipients of the Work or Derivative Works a copy of
	this License; and
	You must cause any modified files to carry prominent notices stating that You
	changed the files; and
	You must retain, in the Source form of any Derivative Works that You distribute,
	all copyright, patent, trademark, and attribution notices from the Source form
	of the Work, excluding those notices that do not pertain to any part of the
	Derivative Works; and
	If the Work includes a "NOTICE" text file as part of its distribution, then any
	Derivative Works that You distribute must include a readable copy of the
	attribution notices contained within such NOTICE file, excluding those notices
	that do not pertain to any part of the Derivative Works, in at least one of the
	following places: within a NOTICE text file distributed as part of the
	Derivative Works; within the Source form or documentation, if provided along
	with the Derivative Works; or, within a display generated by the Derivative
	Works, if and wherever such third-party notices normally appear. The contents of
	the NOTICE file are for informational purposes only and do not modify the
	License. You may add Your own attribution notices within Derivative Works that
	You distribute, alongside or as an addendum to the NOTICE text from the Work,
	provided that such additional attribution notices cannot be construed as
	modifying the License.
	You may add Your own copyright statement to Your modifications and may provide
	additional or different license terms and conditions for use, reproduction, or
	distribution of Your modifications, or for any such Derivative Works as a whole,
	provided Your use, reproduction, and distribution of the Work otherwise complies
	with the conditions stated in this License.
	
	5. Submission of Contributions.
	
	Unless You explicitly state otherwise, any Contribution intentionally submitted
	for inclusion in the Work by You to the Licensor shall be under the terms and
	conditions of this License, without any additional terms or conditions.
	Notwithstanding the above, nothing herein shall supersede or modify the terms of
	any separate license agreement you may have executed with Licensor regarding
	such Contributions.
	
	6. Trademarks.
	
	This License does not grant permission to use the trade names, trademarks,
	service marks, or product names of the Licensor, except as required for
	reasonable and customary use in describing the origin of the Work and
	reproducing the content of the NOTICE file.
	
	7. Disclaimer of Warranty.
	
	Unless required by applicable law or agreed to in writing, Licensor provides the
	Work (and each Contributor provides its Contributions) on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied,
	including, without limitation, any warranties or conditions of TITLE,
	NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A PARTICULAR PURPOSE. You are
	solely responsible for determining the appropriateness of using or
	redistributing the Work and assume any risks associated with Your exercise of
	permissions under this License.
	
	8. Limitation of Liability.
	
	In no event and under no legal theory, whether in tort (including negligence),
	contract, or otherwise, unless required by applicable law (such as deliberate
	and grossly negligent acts) or agreed to in writing, shall any Contributor be
	liable to You for damages, including any direct, indirect, special, incidental,
	or consequential damages of any character arising as a result of this License or
	out of the use or inability to use the Work (including but not limited to
	damages for loss of goodwill, work stoppage, computer failure or malfunction, or
	any and all other commercial damages or losses), even if such Contributor has
	been advised of the possibility of such damages.
	
	9. Accepting Warranty or Additional Liability.
	
	While redistributing the Work or Derivative Works thereof, You may choose to
	offer, and charge a fee for, acceptance of support, warranty, indemnity, or
	other liability obligations and/or rights consistent with this License. However,
	in accepting such obligations, You may act only on Your own behalf and on Your
	sole responsibility, not on behalf of any other Contributor, and only if You
	agree to indemnify, defend, and hold each Contributor harmless for any liability
	incurred by, or claims asserted against, such Contributor by reason of your
	accepting any such warranty or additional liability.
	
	END OF TERMS AND CONDITIONS
```

