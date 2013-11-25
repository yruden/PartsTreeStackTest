# enable RubyInstaller DevKit usage as a vendorable helper library
unless ENV['PATH'].include?('c:\\Ruby192\\DevKit\\mingw\\bin') then
  puts 'Temporarily enhancing PATH to include DevKit...'
  ENV['PATH'] = 'c:\\Ruby192\\DevKit\\bin;c:\\Ruby192\\DevKit\\mingw\\bin;' + ENV['PATH']
end
ENV['RI_DEVKIT'] = 'c:\\Ruby192\\DevKit'
ENV['CC'] = 'gcc'
ENV['CPP'] = 'cpp'
ENV['CXX'] = 'g++'
